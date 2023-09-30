import { useState } from "react";

export default function useForceUpdate() {
    const [, setToggle] = useState(false);
    return () => setToggle((toggle) => !toggle);
}
