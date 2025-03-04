import React from "react";
import { Drawer } from "antd";
import "./styles.scss";

export interface BottomActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  height?: number | string;
  zIndex?: number;
  className?: string;
  showClose?: boolean;
  footerContent?: React.ReactNode;
}

export const BottomActionSheet: React.FC<BottomActionSheetProps> = ({
  isOpen,
  onClose,
  children,
  height = 300,
  zIndex = 1050,
  className = "",
  footerContent,
}) => {
  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      placement="bottom"
      height={height}
      zIndex={zIndex}
      closeIcon={false}
      className={`bottom-action-sheet ${className}`}
      footer={footerContent && <div className="bottom-action-sheet-footer">{footerContent}</div>}
    >
      <div className="bottom-action-sheet-content">{children}</div>
    </Drawer>
  );
};
