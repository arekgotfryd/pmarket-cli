module.exports = {
  homedir: jest.fn(() => process.cwd()),
  // Other methods from the os module that you may need to mock can be added here.
};
