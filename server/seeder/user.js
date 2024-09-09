import { faker } from "@faker-js/faker";
import { UserModel } from "../models/userModel.js";

const createUser = async (numUsers) => {
  try {
    const usersPromise = [];

    for (let i = 0; i < numUsers; i++) {
      const tempUser = UserModel.create({
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        bio: faker.lorem.sentence(10),
        email: faker.internet.email(),
        password: "password",
        avatar: {
          url: faker.image.avatar(),
          public_id: faker.system.fileName(),
        },
      });
      usersPromise.push(tempUser);
    }

    await Promise.all(usersPromise);

    console.log("Users created", numUsers);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export { createUser };
