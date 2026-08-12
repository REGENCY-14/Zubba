import { customerService } from "../api/customerService";
import { setCustomer } from "../slices/customer/customerSlice";
import type { AppDispatch } from "../store/index";

/**
 * Refreshes customer wallet/points data after a successful payment. Does NOT
 * mark the request completed — the backend already transitions the request to
 * "paid" itself (see payment webhook / wallet-pay / cash-confirm handlers on
 * the backend). Actual completion only happens once the driver logs the bag
 * count and confirms collection via the driver app.
 */
export async function refreshCustomerAfterPayment(
  customerId: string,
  dispatch: AppDispatch,
) {
  if (!customerId) return;

  const res = await customerService.getCustomerById(customerId);
  if (res.success && res.data?.customer) {
    dispatch(setCustomer(res.data.customer));
  }
}
