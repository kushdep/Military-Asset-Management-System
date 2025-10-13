import Agenda from 'agenda';
import mongoose from 'mongoose';
import { updateInventory } from './assetTasks.js';

const agenda = new Agenda({ mongo: mongoose.connection });

agenda.define('monthly asset update', async job => {
  console.log('Running monthly asset update at 12:01 AM on 1st day...');
  await updateInventory();
});

(async function() {
  await agenda.start();
  // Runs at 12:01 AM on the 1st day of every month
  await agenda.every('1 0 1 * *', 'monthly asset update');
})();
