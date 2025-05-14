export const removePassword = <T>(user: Partial<T>): Omit<T, 'password'> => {
	const { password, ...rest } = user as unknown as {
		password: string;
	} & T;

	return {
		...rest,
		...(password && {})
	};
};
