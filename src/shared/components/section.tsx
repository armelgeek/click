import Typography from "@/components/atoms/typography";
import { PropsWithChildren, ReactNode } from "react";

/**
 * @deprecated
 */
export function Section({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<div className="grid grid-cols-6 lg:grid-cols-12">
			<div className="col-span-3 mb-12 px-8">
				<Typography>{title}</Typography>
			</div>
			<div className="col-span-9">{children}</div>
		</div>
	);
}

/**
 * @deprecated
 */
export function LabeledSection({
	label,
	children,
}: PropsWithChildren<{ label: string }>) {
	return (
		<div className="relative my-4 group">
			<div className="opacity-20 group-hover:opacity-100 absolute -top-8 left-0 text-stone-200 underline whitespace-nowrap">
				{label}
			</div>
			{children}
		</div>
	);
}
