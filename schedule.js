const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const flightDataManip = require('../../CoreFunc/flightDataManip'); 
const schedule = require('node-schedule');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('scheduleflight')
    .setDescription('Schedule a new flight announcement')
    .addStringOption(option =>
      option.setName('flight_number').setDescription('Flight number').setRequired(true))
    .addStringOption(option =>
      option.setName('departure').setDescription('Departure airport').setRequired(true))
    .addStringOption(option =>
      option.setName('destination').setDescription('Destination airport').setRequired(true))
    .addStringOption(option =>
      option.setName('datetime').setDescription('MM-DD-YYYY HH:mm format').setRequired(true))
    .addChannelOption(option =>
      option.setName('channel').setDescription('Channel to send the announcement in').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Optional: restrict who can use

  async execute(interaction) {
    const flightNumber = interaction.options.getString('flight_number');
    const departure = interaction.options.getString('departure');
    const destination = interaction.options.getString('destination');
    const dateTimeInput = interaction.options.getString('datetime');
    const channel = interaction.options.getChannel('channel');

    const flightTime = new Date(dateTimeInput);
    if (isNaN(flightTime)) {
      return interaction.reply({ content: 'Invalid date format. Use MM-DD-YYYY HH:mm', ephemeral: true });
    }

    const flightDataObject = {
        number: flightNumber,
        hostID: interaction.user.id, 
        departure: departure,
        destination: destination,
        flightRoute: 'N/A',
        date: flightTime,
        pilotID: 'None',
        status: 'No Check-In',
    }

    try {
        await flightDataManip.createFlightData(flightDataObject);
    } catch (error) {
        console.log(error);
        return await interaction.reply({ content: 'An unknown error occured while processing the flight request', flags: MessageFlags.Ephemeral }); 
    }

    const embed = new EmbedBuilder()
      .setTitle(`✈️ Flight ${flightNumber} Announcement`)
      .setDescription(`Flight ${flightNumber} will take place on **${dateTimeInput}** from **${departure}** to **${destination}**.`)
      .addFields(
        { name: '🧑‍✈️ Pilot', value: 'TBD', inline: true },
        { name: '🧍‍♂️ CSRs', value: 'TBD', inline: true },
        { name: '🧑‍💼 Supervisor', value: 'TBD', inline: true },
        { name: '🧳 Passengers', value: 'React below to RSVP!', inline: false }
      )
      .setColor('Blue')
      .setTimestamp();

    const sentMessage = await channel.send({ embeds: [embed] });

    // Save flight data globally for reactions
    global.flightAnnouncements = global.flightAnnouncements || {};
    global.flightAnnouncements[sentMessage.id] = {
      pilot: null,
      csrs: [],
      supervisor: null,
    };

    // Add emojis
    await sentMessage.react('🧑‍✈️');
    await sentMessage.react('🧍‍♂️');
    await sentMessage.react('🧑‍💼');
    await sentMessage.react('🧳');

    // Schedule 24-hour, 15-minute, and start-time reminders
    const jobTimes = [
      { offset: 24 * 60 * 60 * 1000, message: `⏰ 24-hour reminder: Flight ${flightNumber} is tomorrow!` },
      { offset: 15 * 60 * 1000, message: `⏰ 15-minute reminder: Flight ${flightNumber} is about to begin!` },
      { offset: 0, message: `✈️ Flight ${flightNumber} is now starting! @everyone` },
    ];

    for (const { offset, message } of jobTimes) {
      const jobTime = new Date(flightTime.getTime() - offset);
      if (jobTime > new Date()) {
        schedule.scheduleJob(jobTime, () => {
          channel.send(message);
        });
      }
    }

    await interaction.reply({ content: '✅ Flight scheduled and announcement posted!', flags: MessageFlags.Ephemeral });
  },
};