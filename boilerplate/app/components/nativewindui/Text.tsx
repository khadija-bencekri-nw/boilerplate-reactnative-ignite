/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import * as React from "react"

import { cn } from "../../../lib/cn"

import type { TxKeyPath } from "app/i18n"
import { isRTL, translate } from "app/i18n"
import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import type i18n from "i18n-js"
import { Text as RNText } from "react-native"

const textVariants = cva("text-foreground", {
  variants: {
    variant: {
      largeTitle: "text-4xl",
      title1: "text-2xl",
      title2: "text-[22px] leading-7",
      title3: "text-xl",
      heading: "text-[17px] leading-6 font-semibold",
      body: "text-[17px] leading-6",
      callout: "text-base",
      subhead: "text-[15px] leading-6",
      footnote: "text-[13px] leading-5",
      caption1: "text-xs",
      caption2: "text-[11px] leading-4",
    },
    color: {
      primary: "",
      secondary: "text-secondary-foreground/90",
      tertiary: "text-muted-foreground/90",
      quarternary: "text-muted-foreground/50",
    },
  },
  defaultVariants: {
    variant: "body",
    color: "primary",
  },
})

export interface TextProps
  extends React.ComponentPropsWithoutRef<typeof RNText>,
    VariantProps<typeof textVariants> {
  /**
   * Text which is looked up via i18n.
   */
  tx?: TxKeyPath
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: i18n.TranslateOptions

  /**
   * Children components.
   */
  children?: React.ReactNode

  className?: string
}

const TextClassContext = React.createContext<string | undefined>(undefined)

function TextNW({
  className,
  variant,
  color,
  ...props
}: React.ComponentPropsWithoutRef<typeof RNText> & VariantProps<typeof textVariants>) {
  const textClassName = React.useContext(TextClassContext)
  return (
    <RNText className={cn(textVariants({ variant, color }), textClassName, className)} {...props} />
  )
}

function Text(props: TextProps) {
  const { tx, txOptions, text, children, ...rest } = props

  const i18nText = tx && translate(tx, txOptions)
  const content = i18nText || text || children

  return <TextNW {...rest}>{content}</TextNW>
}

export { Text, TextClassContext, textVariants }
