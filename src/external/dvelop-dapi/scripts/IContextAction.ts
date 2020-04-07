interface IContextAction {
    /**
     * URI of navigation target
     */
    href?: string;

    /**
     * Function to execute if contextAction is invoked.
     * @returns {} 
     */
    callback?: () => void;

    /**
     * Name of the function to execute if contextAction is invoked.
     * NOTE: A function with the corresponding callbackName must be registered first and currently only bridges can register such functions. It is not possible for regular resources.
     */
    callbackName? : string;

    /**
     * Arguments for the callback invocation.
     */
    callbackArgs?: any[];

    title: string;

    /**
     * URI of icon
     */
    icon: string;
}