import * as accountServices from "./accountServices";

describe("editAccount", () => {
  let mockAccounts;
  
  beforeEach(() => {
    // Mock accounts data
    mockAccounts = [
      { id: "1", ownerId: "1", currency: "USD", balance: 1000, name: "User1" },
      { id: "2", ownerId: "2", currency: "EUR", balance: 500, name: "User2" },
      { id: "3", ownerId: "3", currency: "EUR", balance: 5000, name: "User3" },
      { id: "4", ownerId: "3", currency: "USD", balance: 50, name: "User4" },
    ];
  });
  
  it("should edit an existing account", async () => {
    // Increase timeout to 10 seconds (10000 milliseconds)
    jest.setTimeout(10000);
  
    // Mock the initial state of accounts
    const initialState = [...mockAccounts];
  
    // Mock the updated account data
    const updatedAccountData = { balance: 1500 };
  
    // Call the editAccount function
    const editedAccount = await accountServices.editAccount("1", updatedAccountData, initialState);
  
    // Expectations
    expect(editedAccount.id).toEqual("1");
    expect(editedAccount.balance).toEqual(1500);
  });
});