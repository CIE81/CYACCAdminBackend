'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const password = 'ASDFgka%#%7sdgS#@54_2134sf';
    const hashed = await bcrypt.hash(password, 10);

    await queryInterface.bulkInsert('users', [
      {
        first_name: 'Ioan',
        last_name: 'Cucerzan',
        email: 'ioan.e.cucerzan@gmail.com',
        phone: '4843541471',
        user_name: 'ioan.cucerzan',
        password: hashed,
        super_admin: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { user_name: 'ioan.cucerzan' });
  }
};
