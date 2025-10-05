import { useState } from "react"

function useFilter() {
    const [assetType, setAssetType] = useState({code:'VCL',name:'Vehicle'})
    const [dateRange, setDateRange] = useState({ from: '', to: '' })
    const [fltrErr, setFltrErr] = useState([])

    function handleAssetType(typeVal) {
        setAssetType((prev) => {
            if (typeVal === "NF") {
                return "";
            }
            return typeVal;
        });
    }

    function handleDateRange(dateFrom,dateTo) {
        const to = new Date(dateTo).getTime();
        const from = new Date(dateFrom).getTime();
        if (from > to) {
            toast.error("Choose valid dates");
            dateTo = "";
            dateFrom = "";
            return;
        }

        setDateRange((prev) => {
            return {
                ...prev,
                date: {
                    fromDate: dateFrom,
                    toDate: dateTo,
                },
            };
        });
    }

    function handleFiltertErr(err) {
        setFltrErr((prev)=>[...prev,err])
    }

    return {
        assetType,
        dateRange,
        fltrErr,
        handleAssetType,
        handleDateRange,
        handleFiltertErr
    }
}

export default useFilter