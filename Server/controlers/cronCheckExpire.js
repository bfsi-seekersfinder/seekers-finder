import cron from 'node-cron'
import Recruiter from '../schema/createRecruiter.mongoose.js';

const checkAndUpdateExpiredUsers = async () => {
    try {
        const currentDate = new Date();

        const result = await Recruiter.updateMany(
            { expireAt: { $lte: currentDate }, planActive: true }, 
            { 
                $set: { 
                    planActive: false,
                    limit: 0,
                    totalView: 0,
                    savedProfile: [],
                    viewedProfile: []
                }
            }
        );

        console.log(`${result.modifiedCount} users marked as inactive.`);
    } catch (error) {
        console.error("Error updating expired users:", error);
    }

    
};

checkAndUpdateExpiredUsers();

cron.schedule("0 0 * * *", () => {
    console.log("Running expire check...");
    checkAndUpdateExpiredUsers();
});

export default checkAndUpdateExpiredUsers; 
