import { FC, useState } from 'react';
import {InputGroup, Input, InputRightElement, Button} from '@chakra-ui/react';

interface PasswordInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput: FC<PasswordInputProps> = ({ onChange }) => {
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)

  return (
    <InputGroup size='md'>
      <Input
        pr='4.5rem'
        type={show ? 'text' : 'password'}
        placeholder='Enter password'
        onChange={onChange}
      />
      <InputRightElement width='4.5rem'>
        <Button h='1.75rem' size='sm' onClick={handleClick}>
          {show ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}

export default PasswordInput
