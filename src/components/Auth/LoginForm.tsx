"use client";
import { useRouter } from "next/navigation";
import { Formik } from "formik";
import * as Yup from "yup";
import { notification, Form as AntForm, Input, Typography, Button } from "antd";
import { useLogin } from "@/hooks/useAuth";
const LoginForm = () => {
  const router = useRouter();
  const { mutate: loginMutate, isPending } = useLogin();
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (
    type: "success" | "info" | "warning" | "error"
  ) => {
    api[type]({
      message: "Login success",
      description: "You will come to room",
    });
  };

  const handleSubmit = (email: string, password: string) => {
    loginMutate(
      { email, password },
      {
        onSuccess: (data) => {
          console.log(JSON.stringify(data));
          openNotificationWithIcon("success");
          router.push("/room");
        },
      }
    );
  };

  return (
    <div>
      {contextHolder}
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Email không hợp lệ")
            .required("Bắt buộc nhập email"),
          password: Yup.string()
            .min(6, "Mật khẩu tối thiểu 6 ký tự")
            .required("Bắt buộc nhập mật khẩu"),
        })}
        onSubmit={({ email, password }) => handleSubmit(email, password)}
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
            className="space-y-6 w-[400px]"
          >
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
              Login
            </Button>
          </AntForm>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
