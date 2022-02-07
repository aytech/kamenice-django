import { Rule } from "antd/lib/form";

interface IValidators {
  getRoommateValidators: (messages: string[], roommates: { id: number }[], guestId: number) => Rule[]
}

export const Validators: IValidators = {
  getRoommateValidators: (messages: string[], roommates: { id: number }[], guestId: number) => {
    return [
      {
        message: messages[ 0 ],
        validator: (_rule: any, value: number): Promise<void | Error> => {
          const duplicates: Array<{ id: number }> = roommates.filter((id: { id: number } | undefined) => {
            return id !== undefined && id.id === value
          })
          if (duplicates === undefined || duplicates.length <= 1) {
            return Promise.resolve()
          }
          return Promise.reject(new Error("Fail roommate validation, duplicate value"))
        }
      },
      {
        message: messages[ 1 ],
        validator: (_rule: any, value: number): Promise<void | Error> => {
          if (guestId !== value) {
            return Promise.resolve()
          }
          return Promise.reject(new Error("Fail roommate validation, equals to guest"))
        }
      }
    ]
  }
}