import Years from './DecadeView/Years';

type DecadeViewProps = React.ComponentProps<typeof Years>;

/**
 * Displays a given decade.
 */
export default function DecadeView(props: DecadeViewProps): React.ReactElement {
	return (
		<div>
			<Years {...props} />
		</div>
	);
}
