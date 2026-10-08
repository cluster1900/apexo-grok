import { type ComponentProps } from "solid-js"

export const Mark = (props: { class?: string }) => {
  return (
    <svg
      data-component="logo-mark"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 16 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path data-slot="logo-logo-mark-shadow" d="M4 12H12V16H4Z" fill="var(--icon-weak-base)" />
      <path
        data-slot="logo-logo-mark-o"
        d="M0 0H16V4H0ZM12 4H16V8H12ZM0 8H16V12H0ZM0 12H4V16H0ZM12 12H16V16H12ZM0 16H16V20H0Z"
        fill="var(--icon-interactive-base)"
      />
    </svg>
  )
}

export const Splash = (props: Pick<ComponentProps<"svg">, "ref" | "class">) => {
  return (
    <svg
      ref={props.ref}
      data-component="logo-splash"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 80 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 60H60V80H20Z" fill="var(--icon-base)" />
      <path
        d="M0 0H80V20H0ZM60 20H80V40H60ZM0 40H80V60H0ZM0 60H20V80H0ZM60 60H80V80H60ZM0 80H80V100H0Z"
        fill="var(--icon-interactive-base)"
      />
    </svg>
  )
}

export const Logo = (props: { class?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 144 42"
      fill="none"
      classList={{ [props.class ?? ""]: !!props.class }}
    >
      <g>
        <path d="M6 24H18V30H6Z" fill="var(--icon-weak-base)" />
        <path d="M0 6H24V12H0ZM18 12H24V18H18ZM0 18H24V24H0ZM0 24H6V30H0ZM18 24H24V30H18ZM0 30H24V36H0Z" fill="var(--icon-base)" />
        <path d="M36 18H48V24H36ZM36 24H48V30H36Z" fill="var(--icon-weak-base)" />
        <path d="M30 6H54V12H30ZM30 12H36V18H30ZM48 12H54V18H48ZM30 18H36V24H30ZM48 18H54V24H48ZM30 24H36V30H30ZM48 24H54V30H48ZM30 30H54V36H30ZM30 36H36V42H30Z" fill="var(--icon-base)" />
        <path d="M66 24H84V30H66Z" fill="var(--icon-weak-base)" />
        <path d="M60 6H84V12H60ZM60 12H66V18H60ZM78 12H84V18H78ZM60 18H84V24H60ZM60 24H66V30H60ZM60 30H84V36H60Z" fill="var(--icon-base)" />
        <path d="M90 6H96V12H90ZM108 6H114V12H108ZM90 12H96V18H90ZM108 12H114V18H108ZM96 18H108V24H96ZM90 24H96V30H90ZM108 24H114V30H108ZM90 30H96V36H90ZM108 30H114V36H108Z" fill="var(--icon-base)" />
        <path d="M126 18H138V24H126ZM126 24H138V30H126Z" fill="var(--icon-weak-base)" />
        <path d="M120 6H144V12H120ZM120 12H126V18H120ZM138 12H144V18H138ZM120 18H126V24H120ZM138 18H144V24H138ZM120 24H126V30H120ZM138 24H144V30H138ZM120 30H144V36H120Z" fill="var(--icon-interactive-base)" />
      </g>
    </svg>
  )
}
