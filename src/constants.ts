import { type SignupFormState } from '@/components/auth/signup-form'
import { type SigninFormState } from '@/components/auth/signin-form'
import { type RestoreFormState } from '@/components/auth/restore-password-form'
import { type AddConcactFormState } from '@/components/my-profile/contacts-list/add-contact-form'
import { type ResetFormState } from '@/components/auth/reset-password-form'
import { type LeaveFormState } from '@/components/my-profile/accounts-list/account-item/leave-button'

export const sessionTokenCookieName = 'SID'

export const genericModelCode = 'generic'

export const signupFormInitialState: SignupFormState = {
  defaultValues: {
    username: "",
    email: "",
    phone: "",
    account: 'default_name',
    account_name: '',
    accept_terms: false,
    accept_pdp: false,
    accept_subscription: false,
  },
  errors: {},
}

export const signinFormInitialState: SigninFormState = {
  defaultValues: {
    identity: ""
  },
  errors: {},
}

export const restoreFormInitialState: RestoreFormState = {
  defaultValues: {
    identity: ""
  },
  errors: {},
}

export const addContactFormInitialState: AddConcactFormState = {
  success: null,
  defaultValues: {
    type: "",
    value: "",
  },
  errors: {},
};

export const resetFormInitialState: ResetFormState = {
  success: null,
  errors: {}
}

export const leaveFormInitialState: LeaveFormState = {
  success: null,
  errors: {}
}
