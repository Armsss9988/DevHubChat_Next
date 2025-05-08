"use client";
import { Modal, Button } from "antd";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

interface ConfirmationModalProps {
  isVisible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  loading?: boolean;
  onCancel: () => void;
  type?: "info" | "warning" | "error" | "success";
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isVisible,
  title,
  message,
  onConfirm,
  onCancel,
  loading,
  type = "info",
}) => {
  const typeIcons = {
    info: (
      <InfoCircleOutlined className="text-blue-500 text-2xl overflow-hidden rounded-full" />
    ),
    warning: (
      <ExclamationCircleOutlined className="text-orange-500 text-2xl bg-yellow-500 overflow-hidden rounded-full" />
    ),
    error: (
      <CloseCircleOutlined className="text-red-500 text-2xl bg-red-500 overflow-hidden rounded-full" />
    ),
    success: (
      <CheckCircleOutlined className="text-green-500 text-2xl bg-green-600 overflow-hidden rounded-full" />
    ),
  };

  return (
    <Modal
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      centered
      className="z-[1100] !dark:bg-gray-900 !bg-blue-500 rounded-3xl"
      style={{ zIndex: 1100 }}
    >
      <div className="flex items-center gap-3 mb-4">
        {typeIcons[type]}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <p className="text-gray-600">{message}</p>
      <div className="flex justify-end gap-3 mt-6">
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          htmlType="submit"
          onClick={onConfirm}
          loading={loading || false}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
