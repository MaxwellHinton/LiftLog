import React, { createContext, useState } from 'react';
import { RegisterUserDto, UpdateUserProfileDto } from '../interfaces';

interface UserData extends RegisterUserDto, UpdateUserProfileDto {}

interface UserContextProps {
    userData: UserData;
    setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

export const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<UserData>({
        yourName: '',
        email: '',
        password: '',
        age: 0,
        gender: '',

        /* optional fields are omitted below
        weight: 0,
        profilePicture: '',
        currentGym: '', 
        */
    });

    return (
        <UserContext.Provider value = {{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;