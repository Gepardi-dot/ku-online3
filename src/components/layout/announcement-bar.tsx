"use client"

import { cn } from "@/lib/utils"

const Marquee = ({ className, reverse, children, ...props }: {
    className?: string,
    reverse?: boolean,
    children: React.ReactNode
}) => {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        className
      )}
    >
      <div
        className={cn("flex min-w-full shrink-0 animate-marquee items-center [gap:var(--gap)]", {
          "[animation-direction:reverse]": reverse,
        })}
      >
        {children}
      </div>
      <div
        className={cn("flex min-w-full shrink-0 animate-marquee items-center [gap:var(--gap)]", {
          "[animation-direction:reverse]": reverse,
        })}
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  )
}

export function AnnouncementBar() {
    return (
        <div className="bg-primary text-primary-foreground">
            <Marquee className="text-sm font-medium">
                 <span className="mx-4">🔥 Free Shipping on Orders Over 25,000 IQD</span>
                 <span className="mx-4">💸 New User Coupon: 5,000 IQD Off</span>
                 <span className="mx-4">☀️ Summer Sale: Up to 70% Off</span>
                 <span className="mx-4">📱 Download App for Exclusive Deals</span>
            </Marquee>
        </div>
    )
}
