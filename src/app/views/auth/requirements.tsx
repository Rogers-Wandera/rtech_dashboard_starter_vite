import { CheckIcon, Text, rem } from "@mantine/core";
import { Cancel } from "@mui/icons-material";

export type passwordrequirements = {
  re: RegExp;
  label: string;
};

export const withspecialchars: passwordrequirements[] = [
  { re: /[0-9]/, label: "Includes number" },
  { re: /[a-z]/, label: "Includes lowercase letter" },
  { re: /[A-Z]/, label: "Includes uppercase letter" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
];

export const withoutspecialchars: passwordrequirements[] = [
  { re: /[0-9]/, label: "Includes number" },
  { re: /[a-z]/, label: "Includes lowercase letter" },
  { re: /[A-Z]/, label: "Includes uppercase letter" },
];

export const withoutuppercase: passwordrequirements[] = [
  { re: /[0-9]/, label: "Includes number" },
  { re: /[a-z]/, label: "Includes lowercase letter" },
];

export const withoutlowercase: passwordrequirements[] = [
  { re: /[0-9]/, label: "Includes number" },
  { re: /[A-Z]/, label: "Includes uppercase letter" },
];

export function getStrength(
  password: string,
  pwlength: number = 5,
  requirements: passwordrequirements[]
) {
  let multiplier = password.length > pwlength ? 0 : 1;
  requirements.forEach((req) => {
    if (!req.re.test(password)) {
      multiplier += 1;
    }
  });
  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

export function PasswordRequirement({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) {
  return (
    <Text
      c={meets ? "teal" : "red"}
      style={{ display: "flex", alignItems: "center" }}
      mt={7}
      size="sm"
    >
      {meets ? (
        <CheckIcon style={{ width: rem(14), height: rem(14) }} />
      ) : (
        <Cancel style={{ width: rem(14), height: rem(14) }} />
      )}{" "}
      <span style={{ marginLeft: "10px" }}>{label}</span>
    </Text>
  );
}
