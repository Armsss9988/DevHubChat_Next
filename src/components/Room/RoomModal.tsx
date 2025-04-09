"use client";
import { Modal, Input, Button, Form } from "antd";
import { useState } from "react";

interface RoomModalProps {
  open: boolean;
  onCancel: () => void;
  onCreate: (name: string, description: string) => void;
  loading: boolean;
}

const RoomModal: React.FC<RoomModalProps> = ({
  open,
  onCancel,
  onCreate,
  loading,
}) => {
  const [name, setRoomName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate(name, description);
    setRoomName("");
    setDescription("");
  };

  return (
    <Modal
      open={open}
      title="Create New Room"
      onCancel={onCancel}
      onOk={handleCreate}
      footer={null}
      loading={loading}
      centered
    >
      <Form layout="vertical" className="space-y-2">
        <Form.Item label="Room Name" required>
          <Input
            placeholder="Enter room name"
            value={name}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Description">
          <Input.TextArea
            placeholder="Enter room description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </Form.Item>
        <div className="flex justify-end space-x-2">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" onClick={handleCreate} loading={loading}>
            Create Room
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default RoomModal;
