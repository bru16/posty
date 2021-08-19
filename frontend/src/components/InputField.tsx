import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
};

export const InputField: React.FC<InputFieldProps> = (props) => {
  const [field, { error }] = useField(props);

  return (
    <FormControl isInvalid={Boolean(error)}>
      <FormLabel htmlFor={props.name}>{props.label}</FormLabel>
      <Input
        {...field}
        type={props.type}
        id={props.name}
        placeholder={props.placeholder}
      />
      {error && <FormErrorMessage p={1}>{error}</FormErrorMessage>}
    </FormControl>
  );
};
