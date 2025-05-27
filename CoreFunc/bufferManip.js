const bufferManip = {
    bufferToString: async function(buffer) {
        try {
            const bufferString = buffer.toString('base64');
            return bufferString;
        } catch (error) {
            throw new Error(`Error converting buffer to string: ${error}`);
        }
    },
    stringToBuffer: async function(base64String) {

        try {
        const stringBuffer = Buffer.from(base64String, 'base64');
        return stringBuffer; 
        } catch (error) {
            throw new Error(`Error converting string into buffer via base64 encodement: ${error}`); 
        }

    },
}; 

module.exports = bufferManip; 