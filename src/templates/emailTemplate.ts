const passwordLostModel = (name: string, token: string) => {
    return `
<!doctype html>
<html lang="fr-FR">

<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Mot de passe oublié</title>
    <meta name="description" content="Mot de passe oublié">
    <style type="text/css">
        a:hover {text-decoration: underline !important;}
    </style>
</head>

<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                            <a href="" title="logo" target="_blank">
                            <img width="375" src="https://i.ibb.co/898J5pv/BUSINESS-CLOUD-Logo.png" title="logo" alt="logo">
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:20px;font-family:'Rubik',sans-serif;">` + name + `, vous avez fait une demande pour réinitialiser votre mot de passe.</h1>
                                        <span style="display:inline-block; vertical-align:middle; margin:16px 0 26px; border-bottom:1px solid #cecece; width: 45%;">&nbsp;</span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            Nous ne pouvons pas simplement vous envoyer votre ancien mot de passe. Un lien unique pour réinitialiser votre mot de passe a été généré pour vous. Pour réinitialiser votre mot de passe, cliquez sur le lien suivant et suivez les instructions.
                                        </p>
                                        <span style="display:inline-block; vertical-align:middle; margin:16px 0 26px; border-bottom:1px solid #cecece; width: 45%;">&nbsp;</span>
                                        <a href="` + token + `" style="background: #2865a2; text-decoration: none!important; font-weight: 500; color: #fff; text-transform: uppercase; font-size: 18px; padding: 10px 24px; display: inline-block; border-radius: 10px; width: 75%;">Réinitialiser mon mot de passe</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                            <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.BusinessCloud.com</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!--/100% body table-->
</body>

</html>`;
};

const sendCodeModel = (name: string, code: number, reason: string) => {
    return `
<!doctype html>
<html lang="fr-FR">

<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Mot de passe oublié</title>
    <meta name="description" content="Mot de passe oublié">
    <style type="text/css">
        a:hover {text-decoration: underline !important;}
    </style>
</head>

<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                            <a href="" title="logo" target="_blank">
                            <img width="375" src="https://i.ibb.co/898J5pv/BUSINESS-CLOUD-Logo.png" alt="BUSINESS-CLOUD-Logo" title="logo" alt="logo">
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:20px;font-family:'Rubik',sans-serif;">` + name + `, vous avez fait une demande d'obtention de code de sécurité ` + reason + `.</h1>
                                        <span style="display:inline-block; vertical-align:middle; margin:16px 0 26px; border-bottom:1px solid #cecece; width: 45%;">&nbsp;</span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            Vous trouverez ci-joint votre code de vérification. Si vous n'êtes pas à l'origine de cette demande, ignorer ce message.
                                        </p>
                                        <span style="display:inline-block; vertical-align:middle; margin:16px 0 26px; border-bottom:1px solid #cecece; width: 45%;">&nbsp;</span>
                                        <p style="background: #2865a2; text-decoration: none!important; font-weight: 500; color: #fff; text-transform: uppercase; font-size: 18px; padding: 10px 24px; display: inline-block; border-radius: 10px; width: 75%;">` + code + `</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                            <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.BusinessCloud.com</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!--/100% body table-->
</body>

</html>`;
};

export { passwordLostModel, sendCodeModel };
