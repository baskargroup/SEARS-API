import * as React from "react"

const Card = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={
      "rounded-xl border bg-white p-6 shadow-sm " + (className || "")
    }
    {...props}
  >
    {children}
  </div>
))

Card.displayName = "Card"
export { Card }
