import { useState } from "react"

function useFilter(assetTypeInit) {
    console.log(assetTypeInit)
    const [assetType, setAssetType] = useState({ code: assetTypeInit.code, name: assetTypeInit.name })
    const [dateRange, setDateRange] = useState({ from: '', to: '' })
    const [fltrErr, setFltrErr] = useState([])

    function handleAssetType(typeVal) {
        setAssetType((prev) => {
            if (typeVal === "NF") {
                return {code:"NF",name:""};
            }
            return {code:typeVal.code,name:typeVal.name};
        });
    }

    function handleDateRange(dateFrom, dateTo) {
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
                from: dateFrom,
                to: dateTo,
            };
        });
    }

    function handleFiltertErr(err) {
        setFltrErr((prev) => [...prev, err])
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