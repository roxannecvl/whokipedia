import {
    Utils
} from "~/utilities/Utils";

export default defineComponent({
    props: {
        message: String,
        n1: Number,
        n2: Number
    },
    render: (props: { message: any }) => {
        return (
            <div>
                { props.message }
                { Utils.getAverage(props.n1, props.n2) }
            </div>
        )
    }
})
