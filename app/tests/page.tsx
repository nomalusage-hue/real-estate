// pages/api/config.ts
import fs from 'fs';
import path from 'path';

export default async function handler() {
    const configPath = path.join(process.cwd(), "src", 'config', 'site.json');

    try {

        fs.writeFileSync(configPath, JSON.stringify({
            name: "TheProperty-1",
            startingYear: 2015,
            founderName: "Sara",
            founderAvatar: "/img/founder-avatar/image-1.jpeg"
        }, null, 2));

        console.log('Config file updated successfully');
    } catch (error) {
        console.log('Error writing config file:', error);
    }
}