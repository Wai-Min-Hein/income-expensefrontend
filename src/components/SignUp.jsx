import { TextInput, Button, Group, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signUpFailure, signUpStart, signUpSuccess } from "../Slices/userSlice";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const dispatch = useDispatch()
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
        userName: '',
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 8 ? "Password must be at least 8 letters" : null,
    },
  });

  const nav = useNavigate()
const handleLogin =async (datas) => {
  dispatch(signUpStart())
  try {
    const res = await axios.post('https://income-expense-utqh.onrender.com/api/auth/signup', datas)
    console.log(res.data.rest);
  dispatch(signUpSuccess())
  nav('/login')

    
  } catch (error) {
    console.log(error);
  dispatch(signUpFailure(error.message))

  }
}
  return (
    <div>
    <h1 className="text-center">Sign Up</h1>

    <Box maw={340} mx="auto">
      <form onSubmit={form.onSubmit((values) => handleLogin(values))}>
      <TextInput
          required
          withAsterisk
          label="Name"
          placeholder="Your Name"
          {...form.getInputProps("userName")}
        />
        <TextInput
          required
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps("email")}
        />

        <TextInput
          required
          withAsterisk
          label="Password"
          placeholder="Enter your Password"
          {...form.getInputProps("password")}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  </div>
  )
}

export default SignUp