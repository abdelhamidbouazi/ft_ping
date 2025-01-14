import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  User,
  Selection,
  ChipProps,
  SortDescriptor,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "./VerticalDotsIcon";
import { useEffect } from "react";
import InviteUser from "./InviteUser";
import {
  KickFromChannel,
  BanFromChannel,
  AddAdmin,
  RemoveAdmin,
  MuteUser,
  UnMuteUser,
  UnBanFromChannel,
} from "@/utils/PostChannel";
import { toast } from "react-toastify";
import ListBlocked from "./ListBlocked";
import useSWR from "swr";
import { getBlockedUsersURLEndpoint, getChannelByIdURLEndpoint } from "@/app/api/axios";
import { getBlockedUsers } from "@/utils/getChannels";
import { UserType } from "@/types/Channels";

const INITIAL_VISIBLE_COLUMNS = ["name", "role", "status", "actions"];
const columns = [
  {name: "ID", uid: "id", sortable: true},
  {name: "NAME", uid: "name", sortable: true},
  {name: "ROLE", uid: "role", sortable: true},
  {name: "STATUS", uid: "status", sortable: true},
  {name: "ACTIONS", uid: "actions"},
];

const statusOptions = [
  {name: "Online", uid: "online"},
  {name: "InGame", uid: "ingame"},
  {name: "Offline", uid: "offline"},
];


export default function ManageUserList({ channelId, Strigger, isSelected }) {
  const {
    isLoading: isLoadingBlockedUsers,
    error: errorBlockedUsers,
    data: blockedUsers,
    mutate: mutateBlockedUsers
} = useSWR(getBlockedUsersURLEndpoint(channelId), getBlockedUsers);
const {
  isLoading: isLoadingChannelById,
  error: errorChannelById,
  data: channelById,
  mutate: mutateChannelById
} = useSWR(getChannelByIdURLEndpoint(channelId), getBlockedUsers);

  const handleUnban = async (id: string) => {
    try {
      const data = await UnBanFromChannel(channelId, id);
      mutateBlockedUsers();
      mutateChannelById();
      toast.success(`-3LA_SLAAMTOO- user unbanned successfully`,
      {
          toastId: 'success1'
      })
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message,
      {
          toastId: 'error1'
      })
    }
  };

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });
  const [users, setUsers] = React.useState([]);
  const [trigger, setTrigger] = React.useState(false);

  useEffect(() => {
    // //console.log("channelById", channelById);
    if (channelById !== undefined && channelById && Array.isArray(channelById)) {
      setUsers(channelById.slice(1)); // remove the first element
    } else {
      console.log("Expected an array but got", channelById);
    }
  }, [blockedUsers, channelById, trigger]);

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.username.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status)
      );
    }

    return filteredUsers;
  }, [users, filterValue, statusFilter, hasSearchFilter]);

  const pages = Math.ceil(1);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: any, b: any) => {
      const first = a[sortDescriptor.column as keyof any] as number;
      const second = b[sortDescriptor.column as keyof any] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const handleSelectChange = async (e, id: string) => {
    const selectedOptionKey = e.target.value;
    if (selectedOptionKey != "0" && selectedOptionKey != "-1") {
      try {
        const data = await MuteUser(channelId, id, selectedOptionKey);
        mutateChannelById();
        toast.success(
          `-HAK_LFA9IRA_DMOK- User muted for ${selectedOptionKey} minutes`,
          {
            toastId: "success1",
          });
          setTrigger((prev) => !prev);
        } catch (error) {
          toast.error(error?.response?.data?.message || error.message,
          {
              toastId: 'error1'
          })
        }
      } else if (selectedOptionKey == "-1") {
        try {
          const data = await UnMuteUser(channelId, id);
          mutateChannelById();
        toast.success(`-7AYED_LIH_LKMAMA- User Unmuted`,
        {
            toastId: 'success1'
        })
        setTrigger((prev) => !prev);
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message,
        {
            toastId: 'error1'
        })
      }
    }
  };
  const handleAddAdmin = async (id: string) => {
    try {
      const data = await AddAdmin(channelId, id);
      mutateChannelById();
      toast.success(`-AYWAAA- new admin added`,
      {
          toastId: 'success1'
      })
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message,
      {
          toastId: 'error1'
      })
    }
  };
  const handleRemoveAdmin = async (id: string) => {
    try {
      const data = await RemoveAdmin(channelId, id);
      mutateChannelById();

      toast.success(`-BACH_JAY_BACH_DAYR- admin removed`,
      {
          toastId: 'success1'
      })
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message,
      {
          toastId: 'error1'
      })
    }
  };
  const handleBan = async (id: string) => {
    try {
      const data = await BanFromChannel(channelId, id);
      toast.success(`-AR3AAAD- user banned`,
      {
          toastId: 'success1'
      })
      mutateBlockedUsers();
      mutateChannelById();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message,
      {
          toastId: 'error1'
      })
    }
  };
  const handleKick = async (id: string) => {
    try {
      const data = await KickFromChannel(channelId, id);
      toast.success(`-AR3AAAD- user kicked`,
      {
          toastId: 'success1'
      })
      mutateChannelById();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message,
      {
          toastId: 'error1'
      })
    }
  };

  const renderCell = React.useCallback((user: UserType, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof UserType];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{
              src: user.Avatar_URL,
              isBordered: true,
              color: "danger",
            }}
            description={user.username}
            name={user.displayName}
            className="text-slate-200" >
            {user.username}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            {user.role === "admin" || user.role === "owner" ? (
              <p className="text-bold text-small capitalize text-orange-600">
                {user.role}
              </p>
            ) : (
              <p className="text-bold text-small capitalize text-slate-200">
                {user.role}
              </p>
            )}
          </div>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem
                  isReadOnly
                  key="theme"
                  className="cursor-default"
                  endContent={
                    <select
                      className="z-10 outline-none w-16 py-0.5 rounded-md text-tiny group-data-[hover=true]:border-default-500 border-small border-default-300 dark:border-default-200 bg-transparent text-default-500"
                      id="theme"
                      name="theme"
                      onChange={(e) => handleSelectChange(e, user.id)}
                    >
                      <option value={"0"}>Select</option>
                      <option value={"30"}>Mute 30 min</option>
                      <option value={"60"}>Mute 1 hour</option>
                      <option value={"720"}>Mute 12 hour</option>
                      <option value={"1440"}>Mute 24 hour</option>
                      <option value={"-1"}>Unmute</option>
                    </select>
                  }
                >
                  Mute
                </DropdownItem>
                {user.role === "member" ? (
                  <DropdownItem
                    color="default"
                    key={"addadmin"}
                    onClick={() => handleAddAdmin(user.id)}
                  >
                    Make Admin
                  </DropdownItem>
                ) : (
                  <DropdownItem
                    color="warning"
                    key={"addAdmin"}
                    onClick={() => handleRemoveAdmin(user.id)}
                  >
                    Remove Admin
                  </DropdownItem>
                )}
                <DropdownItem
                  key="kick"
                  className="text-danger"
                  color="danger"
                  onClick={() => handleKick(user.id)}
                >
                  Kick
                </DropdownItem>
                <DropdownItem
                  key="ban"
                  className="text-danger"
                  color="danger"
                  onClick={() => handleBan(user.id)}
                >
                  Ban
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const topContent = React.useMemo(() => {
    return (
      
        <div className="flex gap-3 items-center bg-midnight text-midnight-secondary border border-midnight-border w-full justify-center rounded-xl">
            
            <InviteUser
              channelId={channelId}
              isInvited={() => {
                setTrigger((prev) => !prev);
              }}
            />
        </div>
    );
  }, [
    channelId,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center items-center ">
        <div className="flex gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            color="default"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            color="default"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, page, pages, hasSearchFilter, onNextPage, onPreviousPage]);

  return (
    <>
      {channelById !== undefined && (
        <>
          <Table
            isCompact
            aria-label="Example table with custom cells, pagination and sorting"
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
              wrapper: "max-h-[382px] h-1/4 bg-midnight border border-midnight-border rounded-xl",
            }}
            selectedKeys={selectedKeys}
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
            hideHeader
          >
            <TableHeader columns={headerColumns} className="">
              {(column) => (
                <TableColumn
                  key={column.uid}
                  // align={column.uid === "actions" ? "center" : "start"}
                  // allowsSorting={column.sortable}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody emptyContent={"No users found"} items={sortedItems}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
          {blockedUsers !== undefined && blockedUsers.length > 0 && (
            <div className="midnight border border-midnight-border rounded-xl items-center">
              <div className="text-center text-slate-200 py-2">Blocked users</div>
              <div className="py-3">
                <ListBlocked
                  channelId={channelId}
                  blockedUsers={blockedUsers}
                  isLoadingBlockedUsers={isLoadingBlockedUsers}
                  mutateBlockedUsers={mutateBlockedUsers}
                  errorBlockedUsers={errorBlockedUsers}
                  handleUnban={handleUnban}
                />
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
