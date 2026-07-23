import { customerService } from "../api/customerService";
import { requestService } from "../api/requestService";
import { setCustomer } from "../slices/customer/customerSlice";
import { markRequestCompleted } from "../slices/request/requestSlice";
import type { AppDispatch } from "../store/index";

/** Simulates driver completing pickup after payment (customer-app demo flow). */
export async function completePickupAfterPayment(
  requestId: string,
  customerId: string,
  dispatch: AppDispatch,
) {
  if (!requestId) return;

  await requestService.updateRequestStatus(requestId, "completed");
  dispatch(markRequestCompleted());

  if (customerId) {
    const res = await customerService.getCustomerById(customerId);
    if (res.success && res.data?.customer) {
      dispatch(setCustomer(res.data.customer));
    }
  }
}
