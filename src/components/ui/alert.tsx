import { useState } from "react"
import type { ButtonProps } from "./button"
import Button from "./button"
import Modal from "./modal"

interface AlertProps {
  btnText: string
  title?: string
  desc: string
  confirmFunc: () => void
  buttonClassName?: string
}

export default function Alert({
  btnText,
  variant,
  title = "Are you absolutely sure?",
  desc,
  confirmFunc,
  buttonClassName,
}: AlertProps & ButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant={variant}
        className={buttonClassName}
        onClick={() => setOpen(true)}
      >
        {btnText}
      </Button>
      <Modal title={title} description={desc} isOpen={open} setIsOpen={setOpen}>
        <div className="inline-flex w-full justify-end gap-2 pt-6">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="accent" onClick={confirmFunc}>
            Continue
          </Button>
        </div>
      </Modal>
    </>
  )
}
