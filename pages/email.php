<?php
// Inclua o carregador automático do Composer
require '../../vendor/autoload.php';

// Crie uma nova instância do PHPMailer
$mail = new PHPMailer\PHPMailer\PHPMailer();

// Configure o PHPMailer para usar SMTP
$mail->isSMTP();

// Desative o envio real de e-mails
$mail->SMTPDebug = 3; // Ative a saída de depuração
$mail->SMTPOptions = array(
    'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
    )
);

// Defina o nome do host do servidor de e-mail
$mail->Host = 'sandbox.smtp.mailtrap.io';

// Defina a porta SMTP - 587 para autenticação TLS
$mail->Port = 2525;

// Defina o mecanismo de criptografia a ser usado - STARTTLS ou SMTPS
$mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;

// Ative a autenticação SMTP
$mail->SMTPAuth = true;

// Defina o nome de usuário e a senha para a autenticação SMTP
$mail->Username = '8fbfb0134d8a1a';
$mail->Password = '3e6b4df11f2ec3';

// Defina o endereço de e-mail e o nome do remetente
$mail->setFrom('amb7184@gmail.com', 'Mailer');

// Adicione um destinatário
$mail->addAddress('tubaro84@gmail.com', 'Joe User');

// Defina o assunto do e-mail
$mail->Subject = 'Teste do PHPMailer';

// Defina o corpo do e-mail
$mail->Body    = 'Este é um teste do PHPMailer.';

// Envie o e-mail
if (!$mail->send()) {
    echo 'A mensagem não pôde ser enviada.';
    echo 'Erro do PHPMailer: ' . $mail->ErrorInfo;
} else {
    echo 'Mensagem enviada com sucesso!';
}
?>
