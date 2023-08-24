<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    />
    <title>PhotoSwipe component</title>

    <style>
        html,
        body {
            height: 100%;
            margin: 0;
            padding: 0;
        }

        html {
            font-size: 10px;
        }

        body {
            font-weight: 400;
            color: #000;
            background-color: #fff;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-size: 1.8rem;
        }

        button {
            cursor: pointer;
            background-color: transparent;
            padding: 0;
            text-decoration: none;
            color: inherit;
            box-shadow: none;
            border: 0
        }

        * {
            box-sizing: border-box;
        }

        [x-cloak] {
            display: none
        }
    </style>

    @vite(['src/resources/index.js'])

    <script
        defer
        src="https://unpkg.com/alpinejs@3.10.3/dist/cdn.min.js"
    ></script>
</head>

<body>
    {!! $slot !!}
</body>

</html>
