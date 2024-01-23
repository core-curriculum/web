import { isValidItemUrlOrId } from "@services/urls";

describe("isValidItemUrlOrId", () => {
  const dummyUrl = "http://localhost/x/YMLTCZPOQmeen-dWyCyzIQ";
  const dummyId = "YMLTCZPOQmeen-dWyCyzIQ";
  const dummyInvalidUrl = "http://localhost/x/invalid";
  const dummyInvalidId = "invalid";
  test("validUrl", () => {
    expect(isValidItemUrlOrId(dummyUrl)).toBe(true);
  });
  test("validId", () => {
    expect(isValidItemUrlOrId(dummyId)).toBe(true);
  });
  test("invalidUrl", () => {
    expect(isValidItemUrlOrId(dummyInvalidUrl)).toBe(false);
  });
  test("invalidId", () => {
    expect(isValidItemUrlOrId(dummyInvalidId)).toBe(false);
  });
});
