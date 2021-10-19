import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  textarea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = (props) => {
  const InputOrTextarea = props.textarea ? Textarea : Input;
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={Boolean(error)}>
      <FormLabel m={1} htmlFor={props.name}>
        {props.label}
      </FormLabel>
      <InputOrTextarea
        {...field}
        type={props.type}
        id={props.name}
        placeholder={props.placeholder}
      />
      {error && <FormErrorMessage p={1}>{error}</FormErrorMessage>}
    </FormControl>
  );
};
