"use client";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form as AntForm, Input, Typography, Button } from "antd";
import { useSignup } from "@/hooks/useAuth";
import { useAppDispatch } from "@/redux/hook";
import { login } from "@/redux/slices/authSlice";
import { useToastMessage } from "@/hooks/useToastMessage";
import { useGlobalToast } from "@/providers/ToastProvider";

const SignupForm = () => {
  const { mutate: signup, isPending } = useSignup();
  const [messageApi] = useGlobalToast();
  const dispatch = useAppDispatch();
  const { toastError } = useToastMessage();

  const handleSubmit = (email: string, password: string, name: string) => {
    signup(
      { email, password, name },
      {
        onSuccess: (data) => {
          messageApi.success("Đăng ký thành công");
          dispatch(login({ user: data.user }));
        },
        onError: toastError,
      }
    );
  };

  return (
    <div>
      <Formik
        initialValues={{ email: "", password: "", name: "" }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Email không hợp lệ")
            .required("Bắt buộc nhập email"),
          password: Yup.string()
            .min(6, "Mật khẩu tối thiểu 6 ký tự")
            .required("Bắt buộc nhập mật khẩu"),
          name: Yup.string().required("Bắt buộc nhập tên hiển thị"),
        })}
        onSubmit={({ email, password, name }) =>
          handleSubmit(email, password, name)
        }
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          errors,
          touched,
        }) => (
          <AntForm
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-6 w-[300px] md:w-[400px]"
          >
            <AntForm.Item
              label={<Typography.Text strong>User Name</Typography.Text>}
              validateStatus={touched.name && errors.name ? "error" : ""}
              help={touched.name && errors.name}
            >
              <Input
                name="name"
                placeholder="Enter your name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </AntForm.Item>

            <AntForm.Item
              label={<Typography.Text strong>Email</Typography.Text>}
              validateStatus={touched.email && errors.email ? "error" : ""}
              help={touched.email && errors.email}
            >
              <Input
                name="email"
                placeholder="Enter your email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </AntForm.Item>

            <AntForm.Item
              label={<Typography.Text strong>Password</Typography.Text>}
              validateStatus={
                touched.password && errors.password ? "error" : ""
              }
              help={touched.password && errors.password}
            >
              <Input.Password
                name="password"
                placeholder="Enter your password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </AntForm.Item>

            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={isPending}
            >
              Signup
            </Button>
          </AntForm>
        )}
      </Formik>
    </div>
  );
};

export default SignupForm;
