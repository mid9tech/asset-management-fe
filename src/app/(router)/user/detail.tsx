import DetailModal from "@components/modal"

import { User } from "../../../__generated__/graphql"
import { formatDate } from "@utils/timeFormat"
import { formatText } from "@utils/formatText"

interface Props {
    user: User
    showModalDetailUser: boolean
    handleCloseDetailModal: () => void

}
export default function DetailUser ({user, showModalDetailUser, handleCloseDetailModal}: Props)  {
    return(
        <DetailModal
        isOpen={showModalDetailUser}
        onClose={handleCloseDetailModal}
        title="Detailed User Information"
      >
        <div className="text-gray">
          <div className="flex mb-2">
            <span className="text-sm w-40">Staff Code:</span>{" "}
            <span className="text-sm">{user.staffCode}</span>
          </div>
          <div className="flex mb-2">
            <span className="text-sm w-40">Full Name:</span>{" "}
            <span className="text-sm">
              {formatText(`${user.firstName} ${user.lastName}`)}
            </span>
          </div>
          <div className="flex mb-2">
            <span className="text-sm w-40">Username:</span>{" "}
            <span className="text-sm">{user.username}</span>
          </div>
          <div className="flex mb-2">
            <span className="text-sm w-40">Date of Birth:</span>{" "}
            <span className="text-sm">
              {(user.dateOfBirth)}
            </span>
          </div>
          <div className="flex mb-2">
            <span className="text-sm w-40">Gender:</span>{" "}
            <span className="text-sm">{user.gender}</span>
          </div>
          <div className="flex mb-2">
            <span className="text-sm w-40">Joined Date:</span>{" "}
            <span className="text-sm">
              {user.joinedDate}
            </span>
          </div>
          <div className="flex mb-2">
            <span className="text-sm w-40">Type:</span>{" "}
            <span className="text-sm">{formatText(user.type)}</span>
          </div>
          <div className="flex mb-2">
            <span className="text-sm w-40">Location:</span>{" "}
            <span className="text-sm">{user.location}</span>
          </div>
        </div>
      </DetailModal>
    )
}