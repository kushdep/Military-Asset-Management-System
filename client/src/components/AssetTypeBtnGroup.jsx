import { itemType } from "../../config";

function AssetTypeBtnGroup({fun,val}) {
  return (
    <div className="row w-75">
      <div className="container p-0">
        <div className="row mb-2">
          <div className="col btn-group gap-1" role="group">
            {itemType.map((item, ind) => (
              <button
                key={ind}
                type="button"
                className={`btn fw-bold ${
                  val === item.code
                    ? `btn-primary`
                    : `btn-outline-primary`
                }`}
                onClick={() => fun(item)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetTypeBtnGroup;
