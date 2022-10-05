<template>
    <div class="app-container">

        <router-view name="appContent"></router-view>

    </div>
</template>

<script>
    export default { };
</script>

<style>
    html, body {
        font-family: 'Noto Sans KR', sans-serif;
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
    }

    .app-container {
        height: 100%;
        width: 100%;
    }

    .card {
        background-color: #FAFAFA;
        padding: 20px;
        border-radius: 20px;
    }

    .divider-horizontal {
        width: 100%;
        height: 1px;
        background: #DDDDDD;
        margin-top: 15px;
        margin-bottom: 15px;
    }

    .divider-vertical {
        width: 1px;
        height: 100%;
        background: #DDDDDD;
        margin-left: 15px;
        margin-right: 15px;
    }

    .loading-indicator:before,
    .loading-indicator:after,
    .loading-indicator {
        border-radius: 50%;
        animation-fill-mode: both;
        animation: loading-indicator 1.8s infinite ease-in-out;
    }
    .loading-indicator {
        position: relative;
        top: -2em;
        width: 2em;
        height: 2em;
        margin-top: 30px;
        margin-bottom: 30px;
        vertical-align: middle;
        pointer-events: none;
        color: #009691;
        animation-delay: -0.16s;
    }
    .loading-indicator:before {
        right: 150%;
        animation-delay: -0.32s;
    }
    .loading-indicator:after {
        left: 150%;
    }
    .loading-indicator:before,
    .loading-indicator:after {
        content: '';
        display: block;
        position: absolute;
        width: inherit;
        height: inherit;
    }
    @keyframes loading-indicator {
        0%, 80%, 100% {
            box-shadow: 0 2em 0 -2em;
        }
        40% {
            box-shadow: 0 2em 0 -0.4em;
        }
    }

    .x-axis {
        font-size: 11px;
        text-anchor: middle;
    }

    .y-axis {
        font-size: 11px;
        text-anchor: middle;
        transform: rotate(-90deg);
    }

    .chart-tooltip {
        position: absolute;

        font-size: 11px;
        color: #FAFAFA;
        text-align: center;

        background-color: #000000;
        padding: 5px;
        border-radius: 5px;
    }

    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: table;
        transition: opacity .3s ease;
    }

    .modal-wrapper {
        display: table-cell;
        vertical-align: middle;
    }

    /*
     * The following styles are auto-applied to elements with
     * transition="modal" when their visibility is toggled
     * by Vue.js.
     *
     * You can easily play with the modal transition by editing
     * these styles.
     */
    .modal-enter {
        opacity: 0;
    }

    .modal-leave-active {
        opacity: 0;
    }

    .modal-enter .modal-container,
    .modal-leave-active .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
</style>
