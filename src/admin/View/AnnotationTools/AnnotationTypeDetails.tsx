import Box from "@mui/material/Box";
import AnnotationType from "../../../common/Model/AnnotationType";
import TextField from "@mui/material/TextField";
import Status from "../../../common/Model/Status";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { FunctionsContext } from "../../ViewModel/FunctionsProvider";
import CommunicationController from "../../../common/Model/Communication/MainCommunicationController";
import LoadingError from "../../../common/View/LoadingError";
import AnnotationTool from "../../../common/Model/AnnotationTool";
import ButtonsFooter from "../../Components/ButtonsFooter";

export default function AnnotationTypeDetails({
    type,
    tool,
    onExit,
}: {
    type: AnnotationType | undefined;
    tool: AnnotationTool;
    onExit: () => void;
}) {
    const [status, setStatus] = useState<Status>(Status.IDLE);

    const [printFunctions, setPrintFunctions] = useState<string[]>([]);
    const [conflictFunctions, setConflictFunctions] = useState<string[]>([]);

    const getFunctions = useContext(FunctionsContext);

    const fetchData = useCallback(async () => {
        setStatus(Status.LOADING);

        try {
            const res = await getFunctions();

            setPrintFunctions(res.print);
            setConflictFunctions(res.conflict);
            setStatus(Status.IDLE);
        } catch (err: any) {
            setStatus(Status.ERROR);
        }
    }, [getFunctions]);

    useEffect(() => {
        fetchData();
        return () => CommunicationController.abortLast();
    }, [fetchData]);

    if (status !== Status.IDLE) {
        return (
            <LoadingError
                status={status}
                onReload={fetchData}
                errorMsg="Errore nel caricamento delle funzioni di annotazione"
            />
        );
    }

    return (
        <AnnotationTypeDetailsForm
            type={type}
            tool={tool}
            printFunctions={printFunctions}
            conflictFunctions={conflictFunctions}
            onExit={onExit}
        />
    );
}

const AnnotationTypeDetailsForm = ({
    type,
    tool,
    printFunctions,
    conflictFunctions,
    onExit,
}: {
    type: AnnotationType | undefined;
    tool: AnnotationTool;
    printFunctions: string[];
    conflictFunctions: string[];
    onExit: () => void;
}) => {
    const [status, setStatus] = useState<Status>(Status.IDLE);

    const [name, setName] = useState<string>(type?.name ?? "");
    const [instructions, setInstructions] = useState<string>(
        type?.annotation_instructions ?? ""
    );
    const [layout, setLayout] = useState<string>(
        type?.annotation_interface ?? ""
    );

    const [printFunction, setPrintFunction] = useState<string>(
        type?.print_function ?? ""
    );
    const [conflictFunction, setConflictFunction] = useState<string>(
        type?.conflict_function ?? ""
    );

    const data = useMemo(() => {
        return {
            name,
            annotation_instructions: instructions,
            annotation_interface: layout,
            print_function: printFunction,
            conflict_function: conflictFunction,
        };
    }, [name, instructions, layout, printFunction, conflictFunction]);

    const newType = useCallback(async () => {
        await tool.addType(data);
        return "Tipo di annotazione creato con successo";
    }, [tool, data]);

    const updateType = useCallback(async () => {
        const updated = await type!.update(data);

        return updated
            ? "Modifiche salvate con successo"
            : "Nessuna modifica da salvare";
    }, [type, data]);

    const saveData = useCallback(async () => {
        setStatus(Status.LOADING);

        try {
            if (!type) return newType();
            return updateType();
        } catch (err: any) {
            setStatus(Status.ERROR);
            return "Errore di salvataggio";
        }
    }, [type, newType, updateType]);

    const handleDelete = useCallback(async () => {
        await tool.deleteType(type!);
        onExit();
    }, [tool, type, onExit]);

    return (
        <Box sx={style.box}>
            <Box sx={style.scrollable}>
                <TextField
                    required
                    variant="standard"
                    value={name}
                    label="Nome"
                    onChange={(e) => setName(e.target.value)}
                    error={name === ""}
                    inputProps={{ maxLength: 255 }}
                />
                <FormControl fullWidth sx={style.marginBig}>
                    <InputLabel id="printFunctionsId">
                        Funzione print
                    </InputLabel>
                    <Select
                        labelId="printFunctionsId"
                        value={printFunction}
                        label="Funzione print"
                        onChange={(e) => setPrintFunction(e.target.value)}
                        error={!printFunction}
                    >
                        {printFunctions.map((fn, index) => (
                            <MenuItem key={index} value={fn}>
                                {fn}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={style.marginBig}>
                    <InputLabel id="conflictFunctionsId">
                        Funzione di individuazione dei conflitti
                    </InputLabel>
                    <Select
                        labelId="conflictFunctionsId"
                        value={conflictFunction}
                        label="Funzione di individuazione dei conflitti"
                        onChange={(e) => setConflictFunction(e.target.value)}
                        error={!conflictFunction}
                    >
                        {conflictFunctions.map((fn, index) => (
                            <MenuItem key={index} value={fn}>
                                {fn}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    value={instructions}
                    label="Istruzioni di annotazione"
                    onChange={(e) => setInstructions(e.target.value)}
                    multiline
                    rows={2}
                    sx={style.marginBig}
                />
                <TextField
                    value={layout}
                    label="Interfaccia di annotazione"
                    onChange={(e) => setLayout(e.target.value)}
                    multiline
                    rows={3}
                    sx={style.marginBig}
                />
            </Box>
            <Box sx={{ flex: 1 }} />
            <ButtonsFooter
                saveDisabled={
                    name === "" ||
                    printFunction === "" ||
                    conflictFunction === ""
                }
                status={status}
                onSave={saveData}
                onDelete={type ? handleDelete : undefined}
                onExit={onExit}
            />
        </Box>
    );
};

const style = {
    box: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
    },
    scrollable: {
        maxHeight: "100%",
        width: "100%",
        overflow: "auto",
        display: "flex",
        flexDirection: "column" as "column",
    },
    marginSmall: {
        marginTop: "8px",
    },
    marginMedium: {
        marginTop: "16px",
    },
    marginBig: {
        marginTop: "24px",
    },
    endpointField: {
        width: "100%",
    },
};
