const nodemailer = require('nodemailer');

/*--- Transporte SMTP ---*/
const transporter = nodemailer.createTransport({
  host:   process.env.MAIL_HOST || 'smtp.gmail.com',
  port:   parseInt(process.env.MAIL_PORT || '587'),
  secure: false, // true para porta 465 e false para outras portas
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/*--- Helpers ---*/
const fmt = n => parseFloat(n || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function statusBadge(method) {
  if (method === 'pix' || method === 'boleto') {
    return `<span style="background:#fbbf24;color:#000;padding:4px 12px;border-radius:6px;font-size:12px;font-weight:700">
      ⏳ AGUARDANDO PAGAMENTO
    </span>`;
  }
  return `<span style="background:#22c55e;color:#fff;padding:4px 12px;border-radius:6px;font-size:12px;font-weight:700">
    ✅ APROVADO
  </span>`;
}

/*--- Template HTML do e-mail ---*/
function buildOrderEmailHTML(order) {
  const itemsRows = (order.items || []).map(p => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;font-size:14px;color:#ccc">
        ${p.name} × ${p.qty || 1}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;font-size:14px;color:#FFCC00;text-align:right;font-weight:700">
        R$ ${fmt(parseFloat(p.price) * (p.qty || 1))}
      </td>
    </tr>
  `).join('');

  const discRow = order.discount > 0 ? `
    <tr>
      <td style="padding:6px 0;font-size:13px;color:#22c55e">Desconto (${order.coupon})</td>
      <td style="padding:6px 0;font-size:13px;color:#22c55e;text-align:right">-R$ ${fmt(order.discount)}</td>
    </tr>
  ` : '';

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <title>Confirmação de Pedido — Vault Experience</title>
</head>
<body style="margin:0;padding:0;background:#000;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#000;padding:40px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#0e0e0e;border-radius:16px;overflow:hidden;border:1px solid #1a1a1a;max-width:600px;width:100%">

        <!-- HEADER -->
        <tr>
          <td style="background:#0e0e0e;border-bottom:3px solid #FFCC00;padding:28px 36px;text-align:center">
            <h1 style="margin:0;font-size:22px;color:#FFCC00;font-family:monospace;letter-spacing:2px">
              🎮 VAULT EXPERIENCE
            </h1>
            <p style="margin:6px 0 0;color:#666;font-size:12px;letter-spacing:1px">
              SEU UNIVERSO GEEK & RETRO
            </p>
          </td>
        </tr>

        <!-- STATUS -->
        <tr>
          <td style="padding:28px 36px 16px;text-align:center">
            ${statusBadge(order.payment?.method)}
            <h2 style="margin:16px 0 8px;font-size:22px;color:#fff">
              ${order.payment?.method === 'pix' || order.payment?.method === 'boleto'
                ? 'Pedido recebido!'
                : 'Compra Realizada com Sucesso!'
              }
            </h2>
            <p style="color:#999;font-size:14px;margin:0">
              Olá, <strong style="color:#fff">${order.customer?.nome || 'Cliente'}</strong>!
              Confira abaixo os detalhes do seu pedido.
            </p>
          </td>
        </tr>

        <!-- ITENS -->
        <tr>
          <td style="padding:16px 36px">
            <h3 style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#FFCC00;margin:0 0 12px">
              📦 Itens do Pedido
            </h3>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${itemsRows}
              <tr>
                <td style="padding:8px 0;font-size:13px;color:#aaa">Frete (${order.shipping?.method || ''})</td>
                <td style="padding:8px 0;font-size:13px;color:#aaa;text-align:right">R$ ${fmt(order.frete)}</td>
              </tr>
              ${discRow}
              <tr>
                <td style="padding:10px 0;font-size:17px;font-weight:700;color:#FFCC00;border-top:1px solid #2a2a2a">Total</td>
                <td style="padding:10px 0;font-size:17px;font-weight:700;color:#FFCC00;text-align:right;border-top:1px solid #2a2a2a">
                  R$ ${fmt(order.total)}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ENTREGA -->
        <tr>
          <td style="padding:16px 36px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="50%" valign="top" style="padding-right:12px">
                  <h3 style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#FFCC00;margin:0 0 10px">
                    📍 Endereço de Entrega
                  </h3>
                  <p style="font-size:13px;color:#ccc;line-height:1.8;margin:0">
                    ${order.shipping?.rua}, ${order.shipping?.num}
                    ${order.shipping?.comp ? '<br>' + order.shipping.comp : ''}<br>
                    ${order.shipping?.bairro} — ${order.shipping?.cidade}/${order.shipping?.uf}<br>
                    CEP: ${order.shipping?.cep}
                  </p>
                </td>
                <td width="50%" valign="top" style="padding-left:12px">
                  <h3 style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#FFCC00;margin:0 0 10px">
                    💳 Pagamento
                  </h3>
                  <p style="font-size:13px;color:#ccc;line-height:1.8;margin:0">
                    ${order.payment?.method === 'pix'    ? '⚡ Pix' : ''}
                    ${order.payment?.method === 'boleto' ? '🧾 Boleto Bancário' : ''}
                    ${order.payment?.method === 'saldo'  ? '💰 Saldo na Carteira' : ''}
                    ${order.payment?.method === 'cartao' ? `💳 Cartão •••• ${order.payment?.cardLast}` : ''}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#0a0a0a;border-top:1px solid #1a1a1a;padding:24px 36px;text-align:center">
            <p style="margin:0;font-size:12px;color:#555">
              Dúvidas? Entre em contato em <a href="mailto:suporte@vaultexperience.com" style="color:#FFCC00;text-decoration:none">suporte@vaultexperience.com</a>
            </p>
            <p style="margin:8px 0 0;font-size:11px;color:#333">
              © 2025 Vault Experience. Todos os direitos reservados.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>
  `.trim();
}

/*--- Função principal de envio ----*/
async function sendOrderConfirmationEmail(order, customerEmail) {
  const isPix    = order.payment?.method === 'pix';
  const isBoleto = order.payment?.method === 'boleto';

  const subject = isPix || isBoleto
    ? `⏳ Pedido recebido — aguardando pagamento | Vault Experience`
    : `✅ Compra confirmada! | Vault Experience`;

  const mailOptions = {
    from:    process.env.MAIL_FROM || '"Vault Experience" <noreply@vaultexperience.com>',
    to:      customerEmail,
    subject,
    html:    buildOrderEmailHTML(order),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email] Enviado para ${customerEmail} — ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('[Email] Erro ao enviar:', err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { sendOrderConfirmationEmail };