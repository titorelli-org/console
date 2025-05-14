import Layout from "@/components/my-profile/layout";
import { ContactsList } from "@/components/my-profile/contacts-list";
import { AccountsList } from "@/components/my-profile/accounts-list";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getUserInPage } from "@/lib/server/get-user-in-page";
import { maskNumber } from "@/lib/server/keymask";

export default async function UserProfile() {
  const user = (await getUserInPage())!;
  const maskedUserId = maskNumber(user.id);

  return (
    <Layout>
      <div className="container max-w-[1080px] px-5 md:px-0 mx-auto">
        <div className="space-y-8">
          <h1 className="text-3xl font-bold">User Profile</h1>
          {/* <UserAvatar initialAvatar={initialData.avatar} /> */}
          {/* <EditableUsername initialUsername={initialData.username} /> */}
          <AccountsList />
          <ContactsList userId={maskedUserId} />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="font-bold">
                Удалить аккаунт
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive">Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
}
