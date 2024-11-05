"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dal_1 = __importDefault(require("./dal"));
const createTables = () => __awaiter(void 0, void 0, void 0, function* () {
    // Create vacation table
    let Q = `
    CREATE TABLE IF NOT EXISTS vacations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        destination VARCHAR(100) NOT NULL,
        description TEXT,
        startDate DATE NOT NULL,
        endDate DATE NOT NULL,
        price INT NOT NULL,
        imageFileName VARCHAR(255)
    );
    `;
    yield (0, dal_1.default)(Q);
    // Create user table
    Q = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(50) NOT NULL,
        lastName VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        token VARCHAR(512),
        role ENUM('User', 'Admin') DEFAULT 'USER'
    );
    `;
    yield (0, dal_1.default)(Q);
    // Create follower table
    Q = `
    CREATE TABLE IF NOT EXISTS follows (
        userId INT NOT NULL,
        vacationId INT NOT NULL,
        PRIMARY KEY (userId, vacationId),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (vacationId) REFERENCES vacations(id) ON DELETE CASCADE
    );
    `;
    yield (0, dal_1.default)(Q);
});
const createSampleData = () => __awaiter(void 0, void 0, void 0, function* () {
    // Inserting example data into user table
    let Q = `
    INSERT INTO users (firstName, lastName, email, password, role) VALUES 
        ('Rivka', 'Samuels', 'rmeks10@gmail.com', '$2b$10$UgS9FHNjmQcUJ8y1FPnWvOpW4T7vgCgCvj7CEMjhDfGBiOtNdO.My', 'ADMIN');
    `;
    yield (0, dal_1.default)(Q);
    // Inserting sample data into vacation table
    Q = `
    INSERT INTO vacations (destination, description, startDate, endDate, price, imageFileName) VALUES 
    ('Paris', 'Enjoy a romantic vacation in Paris with stunning views of the Eiffel Tower, luxury shopping, and world-class cuisine.', '2025-05-01', '2025-05-10', 1200, 'paris.jpg'),
    ('Rome', 'Explore the ancient ruins of the Roman Empire, including the Colosseum and the Vatican City. A journey into history.', '2025-06-15', '2025-06-22', 1500, 'rome.jpg'),
    ('New York', 'Visit the city that never sleeps, enjoy Broadway shows, Central Park, and the iconic Statue of Liberty.', '2025-07-01', '2025-07-10', 2000, 'nyc.jpg'),
    ('Tokyo', 'Discover the bustling metropolis of Tokyo, a blend of traditional temples and cutting-edge technology.', '2025-08-05', '2025-08-15', 1800, 'tokyo.jpg'),
    ('Barcelona', 'Relax on the beaches of Barcelona while admiring Gaudi’s architecture and vibrant Spanish culture.', '2025-09-01', '2025-09-08', 1300, 'barcelona.jpg'),
    ('Sydney', 'Experience the beauty of Sydney, Australia, with the Opera House, Bondi Beach, and the Great Barrier Reef.', '2025-10-01', '2025-10-10', 2200, 'sydney.jpg'),
    ('Cape Town', 'Explore the natural beauty of Cape Town, from Table Mountain to the Cape of Good Hope. A true adventure.', '2025-11-01', '2025-11-10', 1700, 'capetown.jpg'),
    ('Rio de Janeiro', 'Celebrate life in Rio de Janeiro with its world-famous Carnival, Christ the Redeemer statue, and beautiful beaches.', '2025-12-01', '2025-12-10', 1600, 'rio.jpg'),
    ('Bangkok', 'Discover the temples, markets, and street food of Thailand’s capital city. A journey full of culture and flavor.', '2025-10-20', '2025-10-30', 1100, 'bangkok.jpg'),
    ('Istanbul', 'A unique blend of East and West, explore the Blue Mosque, Grand Bazaar, and Bosphorus Strait in Istanbul.', '2025-07-15', '2025-07-25', 1400, 'istanbul.jpg'),
    ('Dubai', 'Experience luxury in Dubai with towering skyscrapers, man-made islands, and desert adventures.', '2025-11-15', '2025-11-25', 2500, 'dubai.jpg'),
    ('Amsterdam', 'Cycle through the canals and tulip fields of Amsterdam, a city rich in culture, history, and art.', '2025-09-20', '2025-09-30', 1350, 'amsterdam.jpg')          
    `;
    yield (0, dal_1.default)(Q);
});
// createTables().then(() => {
// console.log("Done creating tables");
// closeDB();
// });
// 
// createSampleData().then(() => {
// console.log("Done adding data");
// closeDB();
// });
// 
// ts-node ./src/db/initialDB.ts 
