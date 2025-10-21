declare global {
    namespace jest {
        interface Matchers<R> {
            toBeValidHexagram(): R;
            toBeValidDivinationResult(): R;
            toContainHexagramFeatures(): R;
        }
    }
}
export {};
//# sourceMappingURL=setup.d.ts.map