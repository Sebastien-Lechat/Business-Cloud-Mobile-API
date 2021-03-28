import { Client } from '../models/Client';
import { User } from '../models/User';

const emailAlreadyExist = async (emailToFind: string): Promise<boolean> => {
    const alreadyExistC = await Client.findOne({ email: emailToFind });
    const alreadyExistU = await User.findOne({ email: emailToFind });
    return (alreadyExistC || alreadyExistU) ? true : false;
};

export { emailAlreadyExist };
