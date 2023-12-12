import matplotlib.pyplot as plt

def birthday_probability(n):
    p = 1
    for i in range(1, n):
        p *= (366 - i) / 366
    return 1 - p

x = list(range(2, 101))
y = [birthday_probability(i) * 100 for i in x]

plt.plot(x, y, '-o', color='royalblue', linewidth=2, markersize=6)
plt.xlabel('Number of people', fontsize=12)
plt.ylabel('Probability of two people sharing a birthday (%)', fontsize=12)
plt.title('Birthday paradox probability by number of people', fontsize=14)
plt.grid(alpha=0.4)
plt.show()
