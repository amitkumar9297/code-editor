import React from 'react';
import { useColorMode, useColorModeValue, IconButton } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

const ColorModeSwitcher = props => {
    const { toggleColorMode } = useColorMode();
    const text = useColorModeValue('dark', 'light');
    const SwitchIcon = useColorModeValue(FaMoon, FaSun);

    return (
        <IconButton
            size="md"
            fontSize="lg"
            aria-label={`Switch to ${text} mode`}
            pos={'fixed'}
            variant="ghost"
            color="current"
            right={'2'}
            top={4}
            marginLeft="2"
            onClick={toggleColorMode}
            icon={<SwitchIcon />}
            bgColor={'transparent'}
            zIndex={'2'}
            // color='yellow'
            {...props}
        />
    );
};

export default ColorModeSwitcher