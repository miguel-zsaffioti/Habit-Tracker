global.fetch = jest.fn();

jest.mock('@expo/vector-icons', () => {
  const mockReact = require('react');
  const mockRN = require('react-native');
  return {
    FontAwesome6: (props) => mockReact.createElement(mockRN.Text, null, props.name || ''),
    __esModule: true,
  };
});

jest.mock('@expo/vector-icons/AntDesign', () => {
  const mockReact = require('react');
  const mockRN = require('react-native');
  const MockIcon = (props) => mockReact.createElement(mockRN.Text, null, props.name || '');
  return MockIcon;
});
